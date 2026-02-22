<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetLaravelInfoAction
{
    /**
     * Retrieve Laravel framework configuration and environment details.
     *
     * @return array{
     *     framework: string,
     *     laravel_version: string,
     *     environment: string,
     *     debug: bool,
     *     locale: mixed,
     *     timezone: mixed,
     *     app_url: mixed,
     *     cache_driver: mixed,
     *     queue_driver: mixed,
     *     database_driver: mixed,
     *     session_driver: mixed,
     *     broadcast_driver: mixed
     * }
     */
    public function execute(): array
    {
        return [
            'framework' => 'Laravel',
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
            'debug' => (bool) config('app.debug'),
            'locale' => config('app.locale'),
            'timezone' => config('app.timezone'),
            'app_url' => config('app.url'),
            'cache_driver' => config('cache.default'),
            'queue_driver' => config('queue.default'),
            'database_driver' => config('database.default'),
            'session_driver' => config('session.driver'),
            'broadcast_driver' => config('broadcasting.default'),
        ];
    }
}
