<?php

declare(strict_types=1);

use App\Domain\Infos\Actions\GetPhpInfoAction;

it('returns all expected keys', function () {
    $action = new GetPhpInfoAction;
    $result = $action->execute();

    expect($result)->toHaveKeys([
        'php_version',
        'sapi',
        'memory_limit',
        'max_execution_time',
        'extensions',
    ]);
});

it('returns correct php version', function () {
    $result = (new GetPhpInfoAction)->execute();

    expect($result['php_version'])->toBe(PHP_VERSION);
});

it('returns correct sapi name', function () {
    $result = (new GetPhpInfoAction)->execute();

    expect($result['sapi'])->toBe(PHP_SAPI);
});

it('returns max_execution_time as integer', function () {
    $result = (new GetPhpInfoAction)->execute();

    expect($result['max_execution_time'])->toBeInt();
});

it('returns extensions as a sorted array', function () {
    $result = (new GetPhpInfoAction)->execute();

    expect($result['extensions'])->toBeArray()->not->toBeEmpty();

    $sorted = $result['extensions'];
    sort($sorted);
    expect($result['extensions'])->toBe($sorted);
});
