<?php

declare(strict_types=1);

use App\Domain\FeatureFlags\Actions\UpsertFeatureFlagAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Pennant\Feature;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('creates an enabled flag', function () {
    $result = (new UpsertFeatureFlagAction)->execute('new-feature', true);

    expect($result)->toBe(['name' => 'new-feature', 'enabled' => true]);
    expect(Feature::for('global')->active('new-feature'))->toBeTrue();
});

it('creates a disabled flag', function () {
    $result = (new UpsertFeatureFlagAction)->execute('off-feature', false);

    expect($result)->toBe(['name' => 'off-feature', 'enabled' => false]);
    expect(Feature::for('global')->active('off-feature'))->toBeFalse();
});

it('toggles flag from enabled to disabled', function () {
    $action = new UpsertFeatureFlagAction;

    $action->execute('toggle-me', true);
    expect(Feature::for('global')->active('toggle-me'))->toBeTrue();

    $result = $action->execute('toggle-me', false);
    expect($result['enabled'])->toBeFalse();
    expect(Feature::for('global')->active('toggle-me'))->toBeFalse();
});

it('toggles flag from disabled to enabled', function () {
    $action = new UpsertFeatureFlagAction;

    $action->execute('toggle-me', false);
    $result = $action->execute('toggle-me', true);

    expect($result['enabled'])->toBeTrue();
});

it('is idempotent when called with same values', function () {
    $action = new UpsertFeatureFlagAction;

    $first = $action->execute('stable', true);
    $second = $action->execute('stable', true);

    expect($first)->toBe($second);
});
