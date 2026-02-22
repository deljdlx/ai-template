<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\FeatureFlags\Actions\DeleteFeatureFlagAction;
use App\Domain\FeatureFlags\Actions\GetFeatureFlagsAction;
use App\Domain\FeatureFlags\Actions\UpsertFeatureFlagAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class FeatureFlagController extends Controller
{
    public function index(GetFeatureFlagsAction $getFlags): JsonResponse
    {
        return response()->json([
            'scope' => 'global',
            'items' => $getFlags->execute(),
        ]);
    }

    public function store(Request $request, UpsertFeatureFlagAction $upsert): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/'],
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($data['name'], $data['enabled']));
    }

    public function update(string $name, Request $request, UpsertFeatureFlagAction $upsert): JsonResponse
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($name, $data['enabled']));
    }

    public function destroy(string $name, DeleteFeatureFlagAction $delete): JsonResponse
    {
        $delete->execute($name);

        return response()->json(status: 204);
    }
}
