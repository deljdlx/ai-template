<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Infos\Actions\GetLaravelInfoAction;
use App\Domain\Infos\Actions\GetPackagesAction;
use App\Domain\Infos\Actions\GetPhpInfoAction;
use App\Domain\Infos\Actions\GetRuntimeInfoAction;
use Illuminate\View\View;

final class WelcomeController extends Controller
{
    /** Display the welcome page with stack information and installed packages. */
    public function __invoke(
        GetLaravelInfoAction $laravelInfo,
        GetPhpInfoAction $phpInfo,
        GetRuntimeInfoAction $runtimeInfo,
        GetPackagesAction $packages,
    ): View {
        $allPackages = $packages->execute();

        return view('welcome', [
            'laravel' => $laravelInfo->execute(),
            'php' => $phpInfo->execute(),
            'runtime' => $runtimeInfo->execute(),
            'packages' => array_filter($allPackages, static fn (array $p): bool => ! $p['dev']),
            'devPackages' => array_filter($allPackages, static fn (array $p): bool => $p['dev']),
        ]);
    }
}
