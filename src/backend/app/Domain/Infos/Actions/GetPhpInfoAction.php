<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetPhpInfoAction
{
    /**
     * Retrieve PHP runtime information: version, SAPI, limits, loaded extensions.
     *
     * @return array{php_version: string, sapi: string, memory_limit: string|false, max_execution_time: int, extensions: list<string>}
     */
    public function execute(): array
    {
        $extensions = get_loaded_extensions();
        sort($extensions);

        return [
            'php_version' => PHP_VERSION,
            'sapi' => PHP_SAPI,
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => (int) ini_get('max_execution_time'),
            'extensions' => $extensions,
        ];
    }
}
