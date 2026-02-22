<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetRuntimeInfoAction
{
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
