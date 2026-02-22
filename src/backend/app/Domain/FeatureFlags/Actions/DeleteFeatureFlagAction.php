<?php

declare(strict_types=1);

namespace App\Domain\FeatureFlags\Actions;

use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

final class DeleteFeatureFlagAction
{
    private const GLOBAL_SCOPE = 'global';

    /**
     * Deactivate and remove a global feature flag.
     *
     * Wrapped in a transaction so that deactivation and row deletion
     * are atomic — no orphaned Pennant cache if the delete fails.
     */
    public function execute(string $name): void
    {
        DB::transaction(function () use ($name): void {
            Feature::for(self::GLOBAL_SCOPE)->deactivate($name);

            DB::table('features')
                ->where('name', $name)
                ->where('scope', self::GLOBAL_SCOPE)
                ->delete();
        });
    }
}
