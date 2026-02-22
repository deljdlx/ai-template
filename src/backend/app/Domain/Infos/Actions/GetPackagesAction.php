<?php

declare(strict_types=1);

namespace App\Domain\Infos\Actions;

final class GetPackagesAction
{
    public function execute(): array
    {
        $composerJsonPath = base_path('composer.json');
        $composerLockPath = base_path('composer.lock');

        $composerJson = json_decode(file_get_contents($composerJsonPath), true);
        $require = array_keys($composerJson['require'] ?? []);
        $requireDev = array_keys($composerJson['require-dev'] ?? []);

        $installedVersions = $this->getInstalledVersions($composerLockPath);

        $packages = [];

        foreach ($require as $name) {
            $packages[] = [
                'name' => $name,
                'constraint' => $composerJson['require'][$name],
                'version' => $installedVersions[$name] ?? null,
                'dev' => false,
            ];
        }

        foreach ($requireDev as $name) {
            $packages[] = [
                'name' => $name,
                'constraint' => $composerJson['require-dev'][$name],
                'version' => $installedVersions[$name] ?? null,
                'dev' => true,
            ];
        }

        return $packages;
    }

    private function getInstalledVersions(string $lockPath): array
    {
        if (! file_exists($lockPath)) {
            return [];
        }

        $lock = json_decode(file_get_contents($lockPath), true);
        $versions = [];

        foreach ($lock['packages'] ?? [] as $pkg) {
            $versions[$pkg['name']] = $pkg['version'];
        }

        foreach ($lock['packages-dev'] ?? [] as $pkg) {
            $versions[$pkg['name']] = $pkg['version'];
        }

        return $versions;
    }
}
