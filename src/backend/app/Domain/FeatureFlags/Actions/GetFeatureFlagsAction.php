<?php

declare(strict_types=1);

namespace App\Domain\FeatureFlags\Actions;

use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

final class GetFeatureFlagsAction
{
    private const GLOBAL_SCOPE = 'global';

    /**
     * @return array<int, array{name: string, enabled: bool}>
     */
    public function execute(): array
    {
        $scopedFeature = Feature::for(self::GLOBAL_SCOPE);

        $names = DB::table('features')
            ->where('scope', self::GLOBAL_SCOPE)
            ->distinct()
            ->orderBy('name')
            ->pluck('name')
            ->values();

        return $names
            ->map(static fn (string $name): array => [
                'name' => $name,
                'enabled' => $scopedFeature->active($name),
            ])
            ->all();
    }
}
