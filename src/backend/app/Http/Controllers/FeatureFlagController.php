<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\FeatureFlags\Actions\DeleteFeatureFlagAction;
use App\Domain\FeatureFlags\Actions\GetFeatureFlagsAction;
use App\Domain\FeatureFlags\Actions\UpsertFeatureFlagAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

final class FeatureFlagController extends Controller
{
    /**
     * Keep naming constraints centralized to avoid route/body validation drift.
     */
    private const NAME_RULES = ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/'];

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
            'name' => self::NAME_RULES,
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($data['name'], $data['enabled']));
    }

    public function update(string $name, Request $request, UpsertFeatureFlagAction $upsert): JsonResponse
    {
        $validatedName = $this->validateFeatureFlagName($name);

        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($validatedName, $data['enabled']));
    }

    public function destroy(string $name, DeleteFeatureFlagAction $delete): JsonResponse
    {
        $validatedName = $this->validateFeatureFlagName($name);
        $delete->execute($validatedName);

        return response()->json(status: 204);
    }

    /**
     * @throws ValidationException
     */
    private function validateFeatureFlagName(string $name): string
    {
        $validator = Validator::make(['name' => $name], [
            'name' => self::NAME_RULES,
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        /** @var string $validatedName */
        $validatedName = $validator->validated()['name'];

        return $validatedName;
    }
}
