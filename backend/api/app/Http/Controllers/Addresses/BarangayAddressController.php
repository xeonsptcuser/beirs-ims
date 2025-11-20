<?php

namespace App\Http\Controllers\Addresses;

use App\Http\Controllers\Controller;
use App\Models\Address\BarangayAddress;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BarangayAddressController extends Controller
{
    public function index()
    {
        $addresses = BarangayAddress::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $addresses,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:barangay_addresses,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $address = BarangayAddress::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Address saved successfully.',
            'data' => $address,
        ], 201);
    }

    public function update(Request $request, BarangayAddress $address)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('barangay_addresses', 'name')->ignore($address->id)],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $address->fill($validated);
        $address->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Address updated successfully.',
            'data' => $address,
        ]);
    }

    public function destroy(Request $request, BarangayAddress $address)
    {
        $this->ensureAdmin($request);

        $address->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully.',
        ]);
    }

    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || !method_exists($user, 'isAdmin') || !$user->isAdmin()) {
            abort(403, 'Only administrators can manage barangay addresses.');
        }
    }
}
