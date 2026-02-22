<?php

declare(strict_types=1);

use App\Domain\FeatureFlags\Actions\GetFeatureFlagsAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Pennant\Feature;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('returns empty array when no flags exist', function () {
    $result = (new GetFeatureFlagsAction)->execute();

    expect($result)->toBeArray()->toBeEmpty();
});

it('returns flags with name and enabled keys', function () {
    Feature::for('global')->activate('test-flag');

    $result = (new GetFeatureFlagsAction)->execute();

    expect($result)->toHaveCount(1);
    expect($result[0])->toHaveKeys(['name', 'enabled']);
    expect($result[0]['name'])->toBe('test-flag');
    expect($result[0]['enabled'])->toBeTrue();
});

it('returns flags sorted by name', function () {
    Feature::for('global')->activate('zebra');
    Feature::for('global')->activate('alpha');
    Feature::for('global')->activate('middle');

    $result = (new GetFeatureFlagsAction)->execute();

    $names = array_column($result, 'name');
    expect($names)->toBe(['alpha', 'middle', 'zebra']);
});

it('reflects correct enabled state for deactivated flags', function () {
    Feature::for('global')->deactivate('disabled-flag');

    $result = (new GetFeatureFlagsAction)->execute();

    $flag = collect($result)->firstWhere('name', 'disabled-flag');
    expect($flag['enabled'])->toBeFalse();
});
