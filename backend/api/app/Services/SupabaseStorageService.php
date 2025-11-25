<?php

namespace App\Services;

use Aws\S3\S3Client;
use Illuminate\Support\Facades\Storage;

class SupabaseStorageService
{
    protected $disk;
    protected $client;
    protected $bucket;

    public function __construct()
    {
        $this->disk = Storage::disk('supabase');

        // Build real S3 client manually
        $this->client = new S3Client([
            'version' => 'latest',
            'region' => 'us-east-1',
            'endpoint' => env('SUPABASE_S3_ENDPOINT'),
            'use_path_style_endpoint' => true,
            'credentials' => [
                'key' => env('SUPABASE_ACCESS_KEY_ID'),
                'secret' => env('SUPABASE_SECRET_ACCESS_KEY'),
            ],
        ]);

        $this->bucket = env('SUPABASE_BUCKET');
    }

    public function upload($file, string $path): string
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $fullPath = "{$path}/{$filename}";

        $this->disk->put($fullPath, file_get_contents($file));

        return $fullPath;
    }

    public function signedUrl(string $storagePath, string $expiry = '+10 minutes'): string
    {
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $storagePath,
        ]);

        $request = $this->client->createPresignedRequest($cmd, $expiry);

        return (string) $request->getUri();
    }
}
