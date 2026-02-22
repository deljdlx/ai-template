<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('feature flags endpoints', function () {
    it('creates and lists a global feature flag', function () {
        $this->postJson('/api/feature-flags', [
            'name' => 'checkout.v2',
            'enabled' => true,
        ])->assertOk()->assertJson([
            'name' => 'checkout.v2',
            'enabled' => true,
        ]);

        $this->getJson('/api/feature-flags')
            ->assertOk()
            ->assertJsonPath('scope', 'global')
            ->assertJsonFragment([
                'name' => 'checkout.v2',
                'enabled' => true,
            ]);
    });

    it('updates a feature flag enabled state', function () {
        $this->postJson('/api/feature-flags', [
            'name' => 'checkout.v2',
            'enabled' => true,
        ])->assertOk();

        $this->putJson('/api/feature-flags/checkout.v2', [
            'enabled' => false,
        ])->assertOk()->assertJson([
            'name' => 'checkout.v2',
            'enabled' => false,
        ]);
    });

    it('deletes a feature flag', function () {
        $this->postJson('/api/feature-flags', [
            'name' => 'checkout.v2',
            'enabled' => true,
        ])->assertOk();

        $this->deleteJson('/api/feature-flags/checkout.v2')->assertNoContent();

        $this->getJson('/api/feature-flags')
            ->assertOk()
            ->assertJsonMissingPath('items.0.name');
    });

    it('validates feature flag name format', function () {
        $this->postJson('/api/feature-flags', [
            'name' => 'Invalid Name',
            'enabled' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors('name');
    });
});
