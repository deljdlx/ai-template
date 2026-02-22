<?php

declare(strict_types=1);

namespace App\Domain\FeatureFlags\Actions;

use Laravel\Pennant\Feature;

final class UpsertFeatureFlagAction
{
    private const GLOBAL_SCOPE = 'global';

    /**
     * Create or update a global feature flag activation state.
     *
     * Idempotent: calling with the same values produces the same result.
     *
     * @return array{name: string, enabled: bool}
     */
    public function execute(string $name, bool $enabled): array
    {
        $scopedFeature = Feature::for(self::GLOBAL_SCOPE);

        if ($enabled) {
            $scopedFeature->activate($name);
        } else {
            $scopedFeature->deactivate($name);
        }

        return [
            'name' => $name,
            'enabled' => $scopedFeature->active($name),
        ];
    }
}
