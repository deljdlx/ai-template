<?php

declare(strict_types=1);

use App\Domain\FeatureFlags\Actions\DeleteFeatureFlagAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('removes an existing feature flag', function () {
    Feature::for('global')->activate('doomed');

    (new DeleteFeatureFlagAction)->execute('doomed');

    $count = DB::table('features')
        ->where('name', 'doomed')
        ->where('scope', 'global')
        ->count();

    expect($count)->toBe(0);
});

it('handles deletion of non-existent flag gracefully', function () {
    (new DeleteFeatureFlagAction)->execute('never-existed');

    expect(true)->toBeTrue();
});

it('deactivates flag before deleting', function () {
    Feature::for('global')->activate('active-flag');

    (new DeleteFeatureFlagAction)->execute('active-flag');

    expect(Feature::for('global')->active('active-flag'))->toBeFalse();
});
