<?php

declare(strict_types=1);

use App\Domain\Infos\Actions\GetRuntimeInfoAction;

uses(Tests\TestCase::class);

it('returns all expected keys', function () {
    $result = (new GetRuntimeInfoAction)->execute();

    expect($result)->toHaveKeys([
        'app_name',
        'timestamp',
        'utc_timestamp',
        'server_timezone',
    ]);
});

it('returns app name from config', function () {
    $result = (new GetRuntimeInfoAction)->execute();

    expect($result['app_name'])->toBe(config('app.name'));
});

it('returns ISO 8601 formatted timestamps', function () {
    $result = (new GetRuntimeInfoAction)->execute();

    expect($result['timestamp'])->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
    expect($result['utc_timestamp'])->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
});

it('returns utc timestamp ending with +00:00', function () {
    $result = (new GetRuntimeInfoAction)->execute();

    expect($result['utc_timestamp'])->toEndWith('+00:00');
});

it('returns server timezone matching PHP default', function () {
    $result = (new GetRuntimeInfoAction)->execute();

    expect($result['server_timezone'])->toBe(date_default_timezone_get());
});
