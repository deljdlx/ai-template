<?php

declare(strict_types=1);

namespace App\Domain\FeatureFlags\Actions;

use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

final class DeleteFeatureFlagAction
{
    private const GLOBAL_SCOPE = 'global';

    public function execute(string $name): void
    {
        Feature::for(self::GLOBAL_SCOPE)->deactivate($name);

        DB::table('features')
            ->where('name', $name)
            ->where('scope', self::GLOBAL_SCOPE)
            ->delete();
    }
}
