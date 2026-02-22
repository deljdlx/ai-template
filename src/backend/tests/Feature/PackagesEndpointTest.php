<?php

declare(strict_types=1);

it('returns a list of packages as JSON', function () {
    $this->getJson('/api/infos/packages')
        ->assertOk()
        ->assertJsonIsArray()
        ->assertJsonStructure([
            '*' => ['name', 'constraint', 'version', 'dev'],
        ]);
});

it('includes laravel/framework in packages', function () {
    $response = $this->getJson('/api/infos/packages')->assertOk();

    $packages = $response->json();
    $names = array_column($packages, 'name');

    expect($names)->toContain('laravel/framework');
});

it('distinguishes dev and non-dev packages', function () {
    $response = $this->getJson('/api/infos/packages')->assertOk();

    $packages = $response->json();
    $devPackages = array_filter($packages, fn ($p) => $p['dev'] === true);
    $prodPackages = array_filter($packages, fn ($p) => $p['dev'] === false);

    expect($devPackages)->not->toBeEmpty();
    expect($prodPackages)->not->toBeEmpty();
});
