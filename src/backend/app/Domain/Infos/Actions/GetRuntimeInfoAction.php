<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetRuntimeInfoAction
{
    /**
     * Retrieve current server runtime: app name, local and UTC timestamps, timezone.
     *
     * @return array{app_name: mixed, timestamp: string, utc_timestamp: string, server_timezone: string}
     */
    public function execute(): array
    {
        $now = now();

        return [
            'app_name' => config('app.name'),
            'timestamp' => $now->toIso8601String(),
            'utc_timestamp' => $now->utc()->toIso8601String(),
            'server_timezone' => date_default_timezone_get(),
        ];
    }
}
