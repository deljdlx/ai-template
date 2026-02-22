<?php

declare(strict_types=1);

namespace App\Domain\FeatureFlags\Actions;

use Laravel\Pennant\Feature;

final class UpsertFeatureFlagAction
{
    private const GLOBAL_SCOPE = 'global';

    /**
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
