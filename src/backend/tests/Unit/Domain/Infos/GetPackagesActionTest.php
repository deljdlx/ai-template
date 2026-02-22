<?php

declare(strict_types=1);

use App\Domain\Infos\Actions\GetPackagesAction;

uses(Tests\TestCase::class);

it('returns an array of packages', function () {
    $result = (new GetPackagesAction)->execute();

    expect($result)->toBeArray()->not->toBeEmpty();
});

it('returns packages with correct structure', function () {
    $result = (new GetPackagesAction)->execute();

    expect($result[0])->toHaveKeys(['name', 'constraint', 'version', 'dev']);
});

it('includes laravel/framework as non-dev dependency', function () {
    $result = (new GetPackagesAction)->execute();

    $laravel = collect($result)->firstWhere('name', 'laravel/framework');

    expect($laravel)->not->toBeNull();
    expect($laravel['dev'])->toBeFalse();
    expect($laravel['version'])->toBeString();
});

it('marks dev packages with dev flag true', function () {
    $result = (new GetPackagesAction)->execute();

    $devPackages = collect($result)->where('dev', true);
    $nonDevPackages = collect($result)->where('dev', false);

    expect($devPackages)->not->toBeEmpty();
    expect($nonDevPackages)->not->toBeEmpty();
});

it('includes constraint string for each package', function () {
    $result = (new GetPackagesAction)->execute();

    foreach ($result as $pkg) {
        expect($pkg['constraint'])->toBeString()->not->toBeEmpty();
    }
});

it('includes installed version from lock file', function () {
    $result = (new GetPackagesAction)->execute();

    $withVersions = collect($result)->filter(fn ($p) => $p['version'] !== null);

    expect($withVersions)->not->toBeEmpty();
});
