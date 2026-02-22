<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Infos\Actions\GetLaravelInfoAction;
use App\Domain\Infos\Actions\GetPackagesAction;
use App\Domain\Infos\Actions\GetPhpInfoAction;
use App\Domain\Infos\Actions\GetRuntimeInfoAction;
use Illuminate\Http\JsonResponse;

final class InfosController extends Controller
{
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

    public function laravel(GetLaravelInfoAction $laravelInfo): JsonResponse
    {
        return response()->json($laravelInfo->execute());
    }

    public function php(GetPhpInfoAction $phpInfo): JsonResponse
    {
        return response()->json($phpInfo->execute());
    }

    public function runtime(GetRuntimeInfoAction $runtimeInfo): JsonResponse
    {
        return response()->json($runtimeInfo->execute());
    }

    public function packages(GetPackagesAction $packages): JsonResponse
    {
        return response()->json($packages->execute());
    }
}
