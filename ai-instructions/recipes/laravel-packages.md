# Recipe: Laravel — Packages extras

Catalogue de packages courants a installer selon les besoins du projet.

**Cette recipe est interactive**: avant d'installer quoi que ce soit, **presenter le catalogue a l'utilisateur** et lui demander ce qu'il souhaite. Ne jamais installer un package sans confirmation explicite.

---

## Workflow d'installation

1. **Presenter les categories** ci-dessous a l'utilisateur.
2. **Demander** quels packages il veut installer (par categorie ou individuellement).
3. **Installer** uniquement les packages valides.
4. **Publier les configs/migrations** si le package le demande.
5. **Lancer `php artisan migrate`** si des migrations ont ete ajoutees.
6. **Relancer les checks**: `php artisan test && ./vendor/bin/pint --test && ./vendor/bin/phpstan analyse`.
7. **Mettre a jour Boost** si installe: `php artisan boost:update` (Boost detecte les nouveaux packages et genere les guidelines correspondantes).

---

## Authentification & API

Sanctum et Passport couvrent des besoins differents et **peuvent coexister** dans le meme projet. Installer les deux si le projet le necessite.

### Sanctum

Auth tokens pour SPA et apps mobile first-party. Leger, sans OAuth.

```bash
php artisan install:api
```

Cela installe Sanctum, cree `routes/api.php`, et publie les migrations.

**Quand l'utiliser**: SPA (Vue/React/Inertia), app mobile qui consomme sa propre API, authentification first-party par tokens ou cookies.

**Configuration cle**:
```php
// bootstrap/app.php — ajouter le middleware Sanctum
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
})
```

### Passport

OAuth2 complet pour exposer une API a des developpeurs tiers.

```bash
composer require laravel/passport
php artisan passport:install
```

**Quand l'utiliser**: API publique avec clients tiers, authorization code flow, refresh tokens, scopes granulaires.

### Sanctum + Passport ensemble

C'est un cas valide. Exemple typique: Sanctum pour l'auth first-party (SPA, mobile maison) et Passport pour les clients OAuth2 tiers. Utiliser des guards separes pour distinguer les deux:

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    // Routes first-party (SPA, mobile)
});

Route::middleware('auth:api')->group(function () {
    // Routes OAuth2 (clients tiers)
});
```

---

## Feature Flags — Pennant (recommande)

Feature flags first-party Laravel. Rollout progressif, A/B testing, trunk-based development.

```bash
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

**Quand l'utiliser**: deploiement progressif de fonctionnalites, A/B testing, activer/desactiver des features par utilisateur ou segment, trunk-based development avec flags au lieu de branches longues.

**Definir une feature** (class-based, recommande):

```bash
php artisan pennant:feature NewDashboard
```

```php
namespace App\Features;

class NewDashboard
{
    public function resolve(User $user): bool
    {
        return $user->isInternalTeamMember();
    }
}
```

**Verifier une feature**:

```php
use Laravel\Pennant\Feature;

// Dans le code
if (Feature::active(NewDashboard::class)) {
    // ...
}

// Conditional execution
Feature::when(NewDashboard::class,
    fn () => $this->newDashboard(),
    fn () => $this->legacyDashboard(),
);
```

**En Blade**:

```blade
@feature(NewDashboard::class)
    <!-- Nouveau dashboard -->
@else
    <!-- Ancien dashboard -->
@endfeature
```

**Middleware** (proteger des routes):

```php
use Laravel\Pennant\Middleware\EnsureFeaturesAreActive;

Route::middleware(EnsureFeaturesAreActive::using('new-api'))
    ->group(function () {
        // Routes accessibles uniquement si feature active
    });
```

**Activer/desactiver** manuellement:

```php
Feature::activate(NewDashboard::class);           // Pour le scope courant
Feature::for($user)->activate(NewDashboard::class); // Pour un user specifique
Feature::activateForEveryone(NewDashboard::class);  // Pour tout le monde
Feature::deactivateForEveryone(NewDashboard::class);
Feature::purge(NewDashboard::class);               // Supprimer les valeurs stockees
```

**Tests** — utiliser le driver `array` pour isoler les tests:

```xml
<!-- phpunit.xml -->
<env name="PENNANT_STORE" value="array"/>
```

```php
Feature::define(NewDashboard::class, true); // Forcer la valeur en test
```

---

## Spatie — Essentiels

### Permission (roles & ACL)

Roles et permissions en base de donnees. Le standard de l'ecosysteme.

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

**Usage rapide**:
```php
// Creer roles et permissions
$role = Role::create(['name' => 'admin']);
$permission = Permission::create(['name' => 'edit articles']);
$role->givePermissionTo($permission);

// Assigner a un user
$user->assignRole('admin');

// Verifier
$user->hasRole('admin');
$user->can('edit articles');

// Middleware
Route::middleware('role:admin')->group(fn () => ...);
```

### Query Builder (filtres API)

Construit des queries filtrables/triables/incluables a partir des parametres HTTP. Indispensable pour les API REST.

```bash
composer require spatie/laravel-query-builder
```

**Usage rapide**:
```php
// GET /api/invoices?filter[status]=paid&sort=-created_at&include=customer
$invoices = QueryBuilder::for(Invoice::class)
    ->allowedFilters(['status', 'customer_id'])
    ->allowedSorts(['created_at', 'amount'])
    ->allowedIncludes(['customer', 'payments'])
    ->paginate(20);
```

### Data (DTOs types)

DTOs avec validation, casting, et serialisation integres. Remplace les DTOs manuels decrits dans `ai-instructions/laravel-coding.md` section 6.

```bash
composer require spatie/laravel-data
```

**Usage rapide**:
```php
class InvoiceData extends Data
{
    public function __construct(
        public int $customer_id,
        #[Min(1)]
        public int $amount,
        public InvoiceStatus $status,
        public CarbonImmutable $due_at,
    ) {}
}

// Depuis une request (validation auto)
$data = InvoiceData::from($request);

// Vers JSON (serialisation auto)
return $data->toArray();
```

### Activity Log (audit trail)

Log automatique des changements sur les models. Essentiel pour la tracabilite.

```bash
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan migrate
```

**Usage rapide**:
```php
// Sur le model
use LogsActivity;

public function getActivitylogOptions(): LogOptions
{
    return LogOptions::defaults()
        ->logOnly(['status', 'amount'])
        ->logOnlyDirty();
}

// Consulter l'historique
$invoice->activities; // Collection des changements
```

### Media Library (fichiers & images)

Upload, conversions d'images, responsive images, stockage multi-disk.

```bash
composer require spatie/laravel-medialibrary
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations"
php artisan migrate
```

**Usage rapide**:
```php
// Sur le model
use InteractsWithMedia;
implements HasMedia;

// Upload
$invoice->addMedia($request->file('document'))->toMediaCollection('invoices');

// Recuperer
$invoice->getFirstMediaUrl('invoices');
```

### Backup (sauvegarde DB + fichiers)

Backup automatise de la base de donnees et des fichiers, local ou cloud.

```bash
composer require spatie/laravel-backup
php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"
```

**Usage rapide**:
```bash
php artisan backup:run
php artisan backup:list
php artisan backup:clean
```

Configurer le schedule dans `routes/console.php`:
```php
Schedule::command('backup:run')->daily()->at('03:00');
Schedule::command('backup:clean')->daily()->at('04:00');
```

### Settings (configuration persistee)

Settings types stockes en base, avec valeurs par defaut et cache.

```bash
composer require spatie/laravel-settings
php artisan vendor:publish --provider="Spatie\LaravelSettings\LaravelSettingsServiceProvider" --tag="migrations"
php artisan migrate
```

**Usage rapide**:
```php
class GeneralSettings extends Settings
{
    public string $site_name;
    public bool $maintenance_mode;

    public static function group(): string
    {
        return 'general';
    }
}

// Lire
app(GeneralSettings::class)->site_name;

// Ecrire
app(GeneralSettings::class)->site_name = 'Mon App';
app(GeneralSettings::class)->save();
```

---

## Spatie — Selon les besoins

### Sluggable

Slugs automatiques sur les models.

```bash
composer require spatie/laravel-sluggable
```

```php
use HasSlug;

public function getSlugOptions(): SlugOptions
{
    return SlugOptions::create()
        ->generateSlugsFrom('name')
        ->saveSlugsTo('slug');
}
```

### Model States

Machine a etats sur les models Eloquent (ex: statuts de commande avec transitions controlees).

```bash
composer require spatie/laravel-model-states
```

```php
// Definir les etats
class InvoiceStatus extends State
{
    public static function config(): StateConfig
    {
        return parent::config()
            ->default(Draft::class)
            ->allowTransition(Draft::class, Pending::class)
            ->allowTransition(Pending::class, Paid::class)
            ->allowTransition(Pending::class, Cancelled::class);
    }
}
```

### Tags

Systeme de tags polymorphe reutilisable.

```bash
composer require spatie/laravel-tags
php artisan vendor:publish --provider="Spatie\Tags\TagsServiceProvider" --tag="tags-migrations"
php artisan migrate
```

### Translatable

Models multilingues avec colonnes JSON.

```bash
composer require spatie/laravel-translatable
```

```php
use HasTranslations;

public array $translatable = ['name', 'description'];

// Usage
$product->setTranslation('name', 'fr', 'Chaise');
$product->setTranslation('name', 'en', 'Chair');
```

---

## Autres classiques

### Horizon (monitoring queues Redis)

Dashboard temps reel pour les queues Redis. Necessite Redis.

```bash
composer require laravel/horizon
php artisan horizon:install
```

**Ne pas installer si le projet utilise `QUEUE_CONNECTION=database` ou `sync`.**

### Laravel Excel (import/export)

Import et export de fichiers Excel, CSV, ODS.

```bash
composer require maatwebsite/excel
```

```php
// Export
return Excel::download(new InvoicesExport, 'invoices.xlsx');

// Import
Excel::import(new InvoicesImport, $request->file('file'));
```

### Flysystem S3 (stockage cloud)

Adapter S3 pour le filesystem Laravel. Necessite un bucket AWS/MinIO.

```bash
composer require league/flysystem-aws-s3-v3
```

Configurer dans `.env`:
```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=...
AWS_BUCKET=...
```

---

## Apres installation

1. **Regenerer IDE Helper** (les nouveaux packages ajoutent des facades/models):
   ```bash
   php artisan ide-helper:generate
   php artisan ide-helper:models -N
   php artisan ide-helper:meta
   ```

2. **Mettre a jour Boost** (regenere les guidelines pour les nouveaux packages):
   ```bash
   php artisan boost:update
   ```

3. **Verifier que tout passe**:
   ```bash
   php artisan test
   ./vendor/bin/pint --test
   ./vendor/bin/phpstan analyse
   ```

4. **Ajouter les nouvelles configs au `.env.example`** si le package en necessite.

## Anti-patterns

1. **Installer sans demander**: toujours confirmer avec l'utilisateur avant d'ajouter un package.
2. **Installer "au cas ou"**: chaque package ajoute de la surface de maintenance. N'installer que ce qui est necessaire maintenant.
3. **Oublier les migrations**: la plupart des packages Spatie publient des migrations. Les lancer immediatement.
4. **Ignorer la config publiee**: lire le fichier de config publie et ajuster aux besoins du projet.
5. **Passport sans besoin OAuth2**: si le projet n'a que des clients first-party, Sanctum suffit. Passport n'est justifie que pour des clients tiers.
6. **Horizon sans Redis**: Horizon ne fonctionne qu'avec le driver Redis. Verifier `QUEUE_CONNECTION` avant d'installer.
