<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

use JsonException;

final class GetPackagesAction
{
    /**
     * @return array<int, array{name: string, constraint: string, version: ?string, dev: bool}>
     */
    public function execute(): array
    {
        $composerJson = $this->readJsonFile(base_path('composer.json'));
        if ($composerJson === []) {
            return [];
        }

        $require = array_keys($composerJson['require'] ?? []);
        $requireDev = array_keys($composerJson['require-dev'] ?? []);

        $installedVersions = $this->getInstalledVersions(base_path('composer.lock'));
        $packages = [];

        $this->appendPackages($packages, $composerJson['require'] ?? [], $require, $installedVersions, false);
        $this->appendPackages($packages, $composerJson['require-dev'] ?? [], $requireDev, $installedVersions, true);

        usort($packages, static fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $packages;
    }

    /**
     * @param  array<int, array{name: string, constraint: string, version: ?string, dev: bool}>  $packages
     * @param  array<string, mixed>  $constraints
     * @param  array<int, string>  $names
     * @param  array<string, string>  $installedVersions
     */
    private function appendPackages(
        array &$packages,
        array $constraints,
        array $names,
        array $installedVersions,
        bool $isDev
    ): void {
        foreach ($names as $name) {
            $packages[] = [
                'name' => $name,
                'constraint' => (string) ($constraints[$name] ?? '*'),
                'version' => $installedVersions[$name] ?? null,
                'dev' => $isDev,
            ];
        }
    }

    /**
     * @return array<string, string>
     */
    private function getInstalledVersions(string $lockPath): array
    {
        $lock = $this->readJsonFile($lockPath);
        if ($lock === []) {
            return [];
        }

        $versions = [];

        foreach ($lock['packages'] ?? [] as $pkg) {
            $versions[$pkg['name']] = $pkg['version'];
        }

        foreach ($lock['packages-dev'] ?? [] as $pkg) {
            $versions[$pkg['name']] = $pkg['version'];
        }

        return $versions;
    }

    /**
     * @return array<string, mixed>
     */
    private function readJsonFile(string $path): array
    {
        if (! is_file($path) || ! is_readable($path)) {
            return [];
        }

        try {
            $contents = file_get_contents($path);
            if ($contents === false || $contents === '') {
                return [];
            }

            $decoded = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);

            return is_array($decoded) ? $decoded : [];
        } catch (JsonException) {
            return [];
        }
    }
}
