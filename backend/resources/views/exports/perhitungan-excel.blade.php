<table border="1">
    <thead>
        <tr>
            <th colspan="3">Hasil Perhitungan SAW - {{ $perhitungan->nama_sesi }}</th>
        </tr>
        <tr>
            <th>Ranking</th>
            <th>Alternatif</th>
            <th>Skor</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($hasil['step_4_ranking'] ?? []) as $item)
            <tr>
                <td>{{ $item['ranking'] }}</td>
                <td>{{ $item['alternatif_nama'] }}</td>
                <td>{{ number_format($item['skor'], 6, '.', '') }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
