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

/**
 * CRUD for global-scoped feature flags (Laravel Pennant).
 *
 * Flag names must match [a-z0-9._-] (e.g. "checkout.v2", "dark-mode").
 */
final class FeatureFlagController extends Controller
{
    /** Centralized name rules to keep route param and body validation in sync. */
    private const NAME_RULES = ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/'];

    /** List all global feature flags with their current enabled state. */
    public function index(GetFeatureFlagsAction $getFlags): JsonResponse
    {
        return response()->json([
            'scope' => 'global',
            'items' => $getFlags->execute(),
        ]);
    }

    /** Create or overwrite a global feature flag. */
    public function store(Request $request, UpsertFeatureFlagAction $upsert): JsonResponse
    {
        $data = $request->validate([
            'name' => self::NAME_RULES,
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($data['name'], $data['enabled']));
    }

    /** Update the enabled state of an existing flag. */
    public function update(string $name, Request $request, UpsertFeatureFlagAction $upsert): JsonResponse
    {
        $validatedName = $this->validateFeatureFlagName($name);

        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        return response()->json($upsert->execute($validatedName, $data['enabled']));
    }

    /** Delete a feature flag permanently. Returns 204 No Content. */
    public function destroy(string $name, DeleteFeatureFlagAction $delete): JsonResponse
    {
        $validatedName = $this->validateFeatureFlagName($name);
        $delete->execute($validatedName);

        return response()->json([], 204);
    }

    /**
     * Validate a flag name from a route parameter against the same rules used in body validation.
     *
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
