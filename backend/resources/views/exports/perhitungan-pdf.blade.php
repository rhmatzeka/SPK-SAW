<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Hasil Perhitungan SAW</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #0f172a; }
        h1, h2 { margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        th { background: #e2e8f0; }
        .winner { background: #dcfce7; }
    </style>
</head>
<body>
    <h1>Laporan Hasil Perhitungan SAW</h1>
    <p>Nama sesi: {{ $perhitungan->nama_sesi }}</p>
    <p>Status: {{ $perhitungan->status }}</p>
    <p>Dibuat oleh: {{ optional($perhitungan->user)->name }}</p>

    <h2>Ranking</h2>
    <table>
        <thead>
            <tr>
                <th>Ranking</th>
                <th>Alternatif</th>
                <th>Skor</th>
            </tr>
        </thead>
        <tbody>
            @foreach(($hasil['step_4_ranking'] ?? []) as $item)
                <tr class="{{ $item['ranking'] === 1 ? 'winner' : '' }}">
                    <td>{{ $item['ranking'] }}</td>
                    <td>{{ $item['alternatif_nama'] }}</td>
                    <td>{{ number_format($item['skor'], 6) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Matriks Normalisasi</h2>
    @foreach(($hasil['step_2_normalisasi'] ?? []) as $row)
        <p><strong>{{ $row['alternatif_nama'] }}</strong></p>
        <table>
            <thead>
                <tr>
                    <th>Kriteria</th>
                    <th>Nilai Awal</th>
                    <th>Nilai Normalisasi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($row['values'] as $value)
                    <tr>
                        <td>{{ $value['kriteria_nama'] }}</td>
                        <td>{{ number_format($value['nilai'], 4) }}</td>
                        <td>{{ number_format($value['nilai_normalisasi'], 6) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>
