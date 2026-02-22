<?php

declare(strict_types=1);

use App\Domain\Infos\Actions\GetLaravelInfoAction;

uses(Tests\TestCase::class);

it('returns all expected keys', function () {
    $result = (new GetLaravelInfoAction)->execute();

    expect($result)->toHaveKeys([
        'framework',
        'laravel_version',
        'environment',
        'debug',
        'locale',
        'timezone',
        'app_url',
        'cache_driver',
        'queue_driver',
        'database_driver',
        'session_driver',
        'broadcast_driver',
    ]);
});

it('returns Laravel as framework name', function () {
    $result = (new GetLaravelInfoAction)->execute();

    expect($result['framework'])->toBe('Laravel');
});

it('returns a valid laravel version string', function () {
    $result = (new GetLaravelInfoAction)->execute();

    expect($result['laravel_version'])->toBeString()->toMatch('/^\d+\.\d+/');
});

it('returns debug as boolean', function () {
    $result = (new GetLaravelInfoAction)->execute();

    expect($result['debug'])->toBeBool();
});

it('reads config values from application config', function () {
    $result = (new GetLaravelInfoAction)->execute();

    expect($result['locale'])->toBe(config('app.locale'));
    expect($result['timezone'])->toBe(config('app.timezone'));
    expect($result['cache_driver'])->toBe(config('cache.default'));
    expect($result['database_driver'])->toBe(config('database.default'));
});
