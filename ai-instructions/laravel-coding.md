# Laravel — Architecture et pratiques de code

Guide d'architecture et de patterns pour le code Laravel. Complement de `recipes/stack-laravel.md` qui couvre l'installation et les outils.

Philosophie: **DDD leger**. Organiser le code par domaine metier, pas par couche technique. Garder la puissance de Laravel (Eloquent, Facades, etc.) sans l'enrober dans des abstractions inutiles.

> Ni controller de 500 lignes, ni architecture hexagonale a 12 couches.
> Le juste milieu: des Actions, des Models expressifs, des boundaries claires.

---

## 1. Structure par domaine

Organiser `app/` par domaine metier des que le projet depasse 3-4 models:

```
app/
├── Domain/
│   ├── Billing/
│   │   ├── Actions/           # CreateInvoiceAction, ChargeCustomerAction
│   │   ├── Models/            # Invoice, Payment
│   │   ├── Events/            # InvoicePaid, PaymentFailed
│   │   ├── DTOs/              # InvoiceData (si necessaire)
│   │   └── Exceptions/        # InvoiceAlreadyPaidException
│   ├── Catalog/
│   │   ├── Actions/
│   │   ├── Models/
│   │   └── Enums/
│   └── User/
│       ├── Actions/
│       └── Models/
├── Http/
│   ├── Controllers/           # Restent ici — c'est de l'infra HTTP
│   └── Requests/              # Form Requests (validation)
├── Console/
│   └── Commands/              # Commandes artisan custom
├── Providers/
│   └── AppServiceProvider.php
└── Support/                   # Helpers transverses (si necessaire)
```

Regles:
1. **Un domaine = un dossier** sous `app/Domain/`. Nommer par concept metier (`Billing`, `Catalog`), pas par technique (`Services`, `Repositories`).
2. **Les controllers restent dans `Http/`**. Ils appellent des Actions, c'est tout.
3. **Les Models restent Eloquent**. Pas de repository wrapping Eloquent. C'est le pattern le plus sur-ingenierie de l'ecosysteme Laravel.
4. Pour un petit projet (< 5 models), garder la structure Laravel standard (`app/Models/`, `app/Http/`). Migrer vers Domain quand ca grandit.

## 2. Actions

Le pattern central. Une Action = une classe, une methode publique, une responsabilite.

```php
declare(strict_types=1);

namespace App\Domain\Billing\Actions;

use App\Domain\Billing\DTOs\InvoiceData;
use App\Domain\Billing\Models\Invoice;

final class CreateInvoiceAction
{
    public function execute(InvoiceData $data): Invoice
    {
        $invoice = Invoice::create([
            'customer_id' => $data->customerId,
            'amount' => $data->amount,
            'due_at' => $data->dueAt,
        ]);

        // Side effects explicites
        InvoiceSent::dispatch($invoice);

        return $invoice;
    }
}
```

Regles:
1. **Classe `final`**, methode `execute()` (ou `__invoke()` si on prefere).
2. **Pas d'injection du framework** dans la signature. Les dependances passent par le constructeur (injection auto par le container).
3. **Pas de logique HTTP** (pas de `Request`, pas de `Response`). L'Action est appelable depuis un controller, une commande artisan, un job, un test.
4. **Nommage**: verbe + nom + `Action`. `CreateInvoiceAction`, `SendWelcomeEmailAction`, `ArchiveProjectAction`.
5. Si l'Action fait plus de 30 lignes, la decomposer en sous-Actions.

### Quand creer une Action vs mettre la logique ailleurs

| Situation | Ou mettre la logique |
|-----------|---------------------|
| Operation metier (creer, facturer, archiver) | Action |
| Query simple (liste, recherche, stats) | Controller ou Model scope |
| Mutation triviale (update un champ) | Directement dans le controller |
| Logique reutilisee par 3+ endroits | Action |
| Calcul sur un model (total, statut derive) | Methode sur le Model |

> Ne pas creer une Action pour un CRUD basique. Un `$post->update($request->validated())` dans le controller est parfait.

## 3. Models Eloquent

Le Model est le coeur du domaine en Laravel. L'enrichir avec de la logique metier plutot que la delocaliser.

```php
declare(strict_types=1);

namespace App\Domain\Billing\Models;

use App\Domain\Billing\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'amount',
        'status',
        'due_at',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'status' => InvoiceStatus::class,
            'due_at' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    // ── Relations ──────────────────────

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // ── Scopes ─────────────────────────

    public function scopeOverdue($query)
    {
        return $query
            ->where('status', InvoiceStatus::Pending)
            ->where('due_at', '<', now());
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    // ── Logique metier ─────────────────

    public function isPaid(): bool
    {
        return $this->status === InvoiceStatus::Paid;
    }

    public function isOverdue(): bool
    {
        return ! $this->isPaid() && $this->due_at->isPast();
    }

    public function markAsPaid(): void
    {
        $this->update([
            'status' => InvoiceStatus::Paid,
            'paid_at' => now(),
        ]);
    }
}
```

Regles:
1. **Toujours definir `$fillable`**. Jamais `$guarded = []`.
2. **Toujours caster** les dates, enums, booleans, integers. Pas de cast implicite.
3. **Relations typees**: retour `BelongsTo`, `HasMany`, etc.
4. **Scopes** pour les queries reutilisees. Nommer par intention metier (`overdue`, `active`), pas par implementation (`whereStatusPending`).
5. **Methodes metier** sur le Model pour la logique qui concerne une seule instance: `isPaid()`, `canBeArchived()`, `markAsPaid()`.
6. **Pas de logique complexe** dans le Model. Si ca implique plusieurs models ou des side effects → Action.
7. **`Model::preventLazyLoading()`** en dev (dans `AppServiceProvider`). Les N+1 sont la cause #1 de lenteur.

## 4. Controllers

Un controller est un traducteur HTTP → domaine. Rien de plus.

```php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Billing\Actions\CreateInvoiceAction;
use App\Domain\Billing\DTOs\InvoiceData;
use App\Domain\Billing\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;

final class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::query()
            ->with('customer')
            ->latest()
            ->paginate(20);

        return view('invoices.index', compact('invoices'));
    }

    public function store(StoreInvoiceRequest $request, CreateInvoiceAction $action)
    {
        $invoice = $action->execute(
            InvoiceData::fromRequest($request)
        );

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Facture creee.');
    }
}
```

Regles:
1. **Classe `final`**. L'heritage de controllers est un anti-pattern.
2. **5 methodes max** par controller (les 5 du resourceful: `index`, `create`, `store`, `show`, `edit`, `update`, `destroy`). Si besoin de plus → nouveau controller.
3. **Pas de logique metier**. Le controller valide (via FormRequest), appelle une Action ou un Model, retourne une reponse.
4. **Injection de dependances** dans les parametres de methode. Pas de `app()->make()`.
5. **Toujours eager-load** les relations necessaires a la vue avec `with()`.

## 5. Form Requests

Toute validation sort du controller et va dans un FormRequest.

```php
declare(strict_types=1);

namespace App\Http\Requests;

use App\Domain\Billing\Enums\InvoiceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ou policy check
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'amount' => ['required', 'integer', 'min:1'],
            'status' => ['required', Rule::enum(InvoiceStatus::class)],
            'due_at' => ['required', 'date', 'after:today'],
        ];
    }
}
```

## 6. DTOs

Un DTO est un objet immutable qui transporte des donnees entre couches. Utiliser quand une Action a besoin de **4+ parametres**, ou quand l'objet a un sens semantique en tant qu'unite (ex: `Money`, `Address`, `DateRange`).

> **Alternative**: si `spatie/laravel-data` est installe (voir `recipes/laravel-packages.md`), l'utiliser a la place des DTOs manuels. Il ajoute la validation et la serialisation automatiques.

```php
declare(strict_types=1);

namespace App\Domain\Billing\DTOs;

use App\Http\Requests\StoreInvoiceRequest;
use Carbon\CarbonImmutable;

final readonly class InvoiceData
{
    public function __construct(
        public int $customerId,
        public int $amount,
        public CarbonImmutable $dueAt,
    ) {}

    public static function fromRequest(StoreInvoiceRequest $request): self
    {
        return new self(
            customerId: $request->integer('customer_id'),
            amount: $request->integer('amount'),
            dueAt: CarbonImmutable::parse($request->string('due_at')),
        );
    }
}
```

Regles:
1. **`final readonly class`** avec des proprietes publiques. Pas de getters.
2. **Methodes factory** statiques: `fromRequest()`, `fromArray()`, `fromModel()`.
3. **Ne pas abuser des DTOs**. Si l'Action prend 2 parametres, passer 2 parametres. Pas besoin de DTO.

## 7. Enums

PHP 8.1+ backed enums. Toujours les utiliser a la place des constantes de statut.

```php
declare(strict_types=1);

namespace App\Domain\Billing\Enums;

enum InvoiceStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::Pending => 'En attente',
            self::Paid => 'Payee',
            self::Cancelled => 'Annulee',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Pending => 'yellow',
            self::Paid => 'green',
            self::Cancelled => 'red',
        };
    }
}
```

Regles:
1. **Toujours backed** (`: string` ou `: int`). Necessaire pour le cast Eloquent et la serialisation.
2. **`label()` et `color()`** sur l'enum, pas dans la vue. L'enum porte sa presentation.
3. **Utiliser les enums dans les casts**, les rules de validation (`Rule::enum()`), et les Form Requests.

## 8. Events et Listeners

Decoupler les side effects du flux principal via les events.

```php
// L'Action dispatch l'event
InvoicePaid::dispatch($invoice);

// L'event est simple
final class InvoicePaid
{
    use Dispatchable;

    public function __construct(
        public readonly Invoice $invoice,
    ) {}
}

// Les listeners sont enregistres dans EventServiceProvider ou par decouverte auto
final class SendInvoiceReceipt
{
    public function handle(InvoicePaid $event): void
    {
        Mail::to($event->invoice->customer)
            ->send(new InvoiceReceiptMail($event->invoice));
    }
}
```

Quand utiliser les events:
- Envoi d'email, notification, webhook
- Logging, audit trail
- Mise a jour de cache ou stats
- Tout ce qui n'est **pas** le resultat principal de l'Action

> Si le side effect est critique (ex: debit bancaire), ne pas utiliser un event async. L'appeler directement dans l'Action.

## 9. PHP robuste — pratiques essentielles

### Strict types partout

```php
declare(strict_types=1);
```

Premiere ligne de **chaque** fichier PHP. Sans exception. Pint peut l'ajouter automatiquement.

### Type hints exhaustifs

```php
// Bon
public function calculateTotal(array $items, float $taxRate): int
{
    // ...
}

// Mauvais
public function calculateTotal($items, $taxRate)
{
    // ...
}
```

Types sur: parametres, retours, proprietes. Utiliser `mixed` uniquement si le type est reellement inconnu (cas rare).

### Early return

```php
// Bon
public function process(Order $order): void
{
    if ($order->isPaid()) {
        return;
    }

    if (! $order->hasItems()) {
        throw new EmptyOrderException();
    }

    // logique principale...
}

// Mauvais
public function process(Order $order): void
{
    if (! $order->isPaid()) {
        if ($order->hasItems()) {
            // logique principale imbriquee a 3 niveaux...
        }
    }
}
```

### Match > switch

```php
// Bon
$label = match ($status) {
    'draft' => 'Brouillon',
    'active' => 'Actif',
    'archived' => 'Archive',
};

// Mauvais
switch ($status) {
    case 'draft':
        $label = 'Brouillon';
        break;
    case 'active':
        // ...
}
```

`match` est strict, exhaustif, et retourne une valeur. Toujours le preferer.

### Readonly par defaut

```php
// Classes immutables
final readonly class Money
{
    public function __construct(
        public int $amount,
        public string $currency,
    ) {}
}

// Proprietes readonly dans les classes mutables
final class InvoiceService
{
    public function __construct(
        private readonly PaymentGateway $gateway,
    ) {}
}
```

`readonly` empeche la reassignation accidentelle. L'utiliser partout ou c'est possible.

### Null safety

```php
// Bon — traiter le null explicitement
$user = User::find($id);
if (! $user) {
    throw new ModelNotFoundException('User not found');
}

// Bon — findOrFail quand l'absence est une erreur
$user = User::findOrFail($id);

// Bon — null coalescing quand le default est acceptable
$name = $user->nickname ?? $user->name;

// Mauvais — ignorer le null
$user = User::find($id);
$user->sendNotification(); // NullPointerException potentiel
```

### Exceptions specifiques

```php
// Bon — exception du domaine
throw new InvoiceAlreadyPaidException($invoice->id);

// Mauvais — exception generique
throw new \Exception('Invoice already paid');
throw new \RuntimeException('Error');
```

Creer des exceptions par domaine. Elles sont documentantes et catchables individuellement.

## 10. Migrations

```php
public function up(): void
{
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();
        $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
        $table->unsignedInteger('amount');
        $table->string('status')->default('draft');
        $table->date('due_at');
        $table->timestamp('paid_at')->nullable();
        $table->timestamps();

        // Index sur les colonnes filtrees frequemment
        $table->index(['status', 'due_at']);
    });
}
```

Regles:
1. **Foreign keys explicites** avec `constrained()`. Definir `cascadeOnDelete()` ou `nullOnDelete()` selon le besoin.
2. **Index sur les colonnes WHERE et ORDER BY**. Pas d'index sur tout, mais pas d'oubli non plus.
3. **Montants en integer** (centimes), jamais en float/decimal. `$table->unsignedInteger('amount')`.
4. **Statuts en string** (pour les enums backed). `$table->string('status')`, pas `$table->enum()` (non portable).
5. **Toujours implementer `down()`** ou lancer une exception `throw new RuntimeException('Irreversible')`.

## 11. Routes

```php
// routes/web.php
use App\Http\Controllers\InvoiceController;

Route::middleware('auth')->group(function () {
    Route::resource('invoices', InvoiceController::class);

    // Routes custom nommees
    Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'pay'])
        ->name('invoices.pay');
});
```

Regles:
1. **Resourceful par defaut**. `Route::resource()` pour le CRUD standard.
2. **Nommer toutes les routes**. Jamais d'URL en dur dans le code (`route('invoices.show', $invoice)`).
3. **URLs en kebab-case**: `/user-profiles`, `/order-items`.
4. **Pas de logique dans les routes**. Pas de closures. Toujours pointer vers un controller.
5. **Grouper par middleware** (`auth`, `admin`, `api`).

## 12. API (si applicable)

```php
// routes/api.php — installer avec: php artisan install:api
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('invoices', Api\InvoiceController::class);
});
```

Regles:
1. **`apiResource`** au lieu de `resource` (pas de `create`/`edit` qui retournent des vues).
2. **API Resources** pour la serialisation. Ne jamais retourner un Model directement (fuite de colonnes).
3. **Pagination** toujours. `->paginate(20)`, jamais `->get()` sans limite sur une collection potentiellement large.
4. **HTTP status codes corrects**: 201 pour creation, 204 pour suppression, 422 pour validation.

## Anti-patterns

1. **Fat controller**: logique metier dans le controller. → Extraire en Action.
2. **Fat model**: model de 500+ lignes. → Traits, concerns, ou Actions pour la logique complexe.
3. **Service fourre-tout**: `InvoiceService` avec 20 methodes. → Actions separees, une responsabilite chacune.
4. **DTO pour tout**: creer un DTO pour passer 2 parametres. → Passer les parametres directement (seuil: 4+ parametres ou unite semantique).
5. **Interface sans raison**: `InvoiceRepositoryInterface` avec une seule implementation. → Creer l'interface quand il y a un vrai besoin de polymorphisme.
6. **Logique dans les Blade**: `@if ($order->items->sum('price') * 1.2 > 100)`. → Methode sur le Model ou computed dans le controller.
7. **Transaction oubliee**: operations multi-tables sans `DB::transaction()`. → Toujours wrapper les operations qui doivent etre atomiques.
8. **N+1 silencieux**: boucle sur une collection sans eager-loading. → `with()` dans la query, `preventLazyLoading()` en dev.
9. **Montants en float**: `$table->decimal('price')` et calculs flottants. → Integer en centimes, conversion a l'affichage.
