<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Infos\Actions\GetLaravelInfoAction;
use App\Domain\Infos\Actions\GetPackagesAction;
use App\Domain\Infos\Actions\GetPhpInfoAction;
use App\Domain\Infos\Actions\GetRuntimeInfoAction;
use Illuminate\Http\JsonResponse;

/**
 * Stack diagnostics endpoints.
 *
 * Exposes read-only information about the Laravel framework, PHP runtime,
 * server environment, and installed Composer packages.
 */
final class InfosController extends Controller
{
    /** Combined response: Laravel + PHP + Runtime in a single call. */
    public function index(
        GetLaravelInfoAction $laravelInfo,
        GetPhpInfoAction $phpInfo,
        GetRuntimeInfoAction $runtimeInfo
    ): JsonResponse {
        return response()->json([
            'laravel' => $laravelInfo->execute(),
            'php' => $phpInfo->execute(),
            'runtime' => $runtimeInfo->execute(),
        ]);
    }

    /** Laravel framework version, environment, and driver configuration. */
    public function laravel(GetLaravelInfoAction $laravelInfo): JsonResponse
    {
        return response()->json($laravelInfo->execute());
    }

    /** PHP version, SAPI, memory limits, and loaded extensions. */
    public function php(GetPhpInfoAction $phpInfo): JsonResponse
    {
        return response()->json($phpInfo->execute());
    }

    /** Application name, local/UTC timestamps, and server timezone. */
    public function runtime(GetRuntimeInfoAction $runtimeInfo): JsonResponse
    {
        return response()->json($runtimeInfo->execute());
    }

    /** Installed Composer packages with version constraints and dev flag. */
    public function packages(GetPackagesAction $packages): JsonResponse
    {
        return response()->json($packages->execute());
    }
}
