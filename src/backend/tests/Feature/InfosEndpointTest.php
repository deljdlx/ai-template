<?php

declare(strict_types=1);

describe('GET /api/infos', function () {
    it('returns combined laravel, php and runtime info', function () {
        $this->getJson('/api/infos')
            ->assertOk()
            ->assertJsonStructure([
                'laravel' => ['framework', 'laravel_version', 'environment'],
                'php' => ['php_version', 'sapi', 'extensions'],
                'runtime' => ['app_name', 'timestamp', 'server_timezone'],
            ]);
    });
});

describe('GET /api/infos/laravel', function () {
    it('returns laravel framework info', function () {
        $this->getJson('/api/infos/laravel')
            ->assertOk()
            ->assertJsonStructure([
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
        $this->getJson('/api/infos/laravel')
            ->assertOk()
            ->assertJsonPath('framework', 'Laravel');
    });
});

describe('GET /api/infos/php', function () {
    it('returns php runtime info', function () {
        $this->getJson('/api/infos/php')
            ->assertOk()
            ->assertJsonStructure([
                'php_version',
                'sapi',
                'memory_limit',
                'max_execution_time',
                'extensions',
            ]);
    });

    it('returns extensions as array', function () {
        $response = $this->getJson('/api/infos/php')->assertOk();

        expect($response->json('extensions'))->toBeArray()->not->toBeEmpty();
    });
});

describe('GET /api/infos/runtime', function () {
    it('returns runtime info', function () {
        $this->getJson('/api/infos/runtime')
            ->assertOk()
            ->assertJsonStructure([
                'app_name',
                'timestamp',
                'utc_timestamp',
                'server_timezone',
            ]);
    });

    it('returns valid ISO 8601 timestamps', function () {
        $response = $this->getJson('/api/infos/runtime')->assertOk();

        expect($response->json('timestamp'))->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
        expect($response->json('utc_timestamp'))->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
    });
});
