<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetLaravelInfoAction
{
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
