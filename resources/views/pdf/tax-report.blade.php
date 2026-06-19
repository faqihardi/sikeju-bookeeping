@extends('pdf.layout')

@section('title', 'Laporan Pajak PPh Final')
@section('report_title', 'Laporan Pajak (PPh Final 0,5%)')
@section('report_period', 'Tahun Pajak: ' . $selectedYear)

@section('content')
<!-- KOTOR / KETENTUAN HUKUM -->
<div style="background-color: #ebf8ff; border: 1px solid #bee3f8; color: #2b6cb0; padding: 10px; border-radius: 4px; font-size: 8pt; margin-bottom: 15px;">
    <strong>Dasar Hukum PPh Final UMKM (CV):</strong><br>
    Berdasarkan Peraturan Pemerintah (PP) No. 55 Tahun 2022, Wajib Pajak Badan berbentuk CV (Badan Usaha) dikenakan PPh Final dengan tarif <strong>0,5% flat</strong> dari omzet bruto setiap bulannya (dihitung sejak rupiah pertama, tanpa fasilitas pembebasan PTKP Rp 500 Juta pertahun yang hanya berlaku untuk Wajib Pajak Orang Pribadi). Batas waktu penyetoran pajak terutang adalah maksimal tanggal 15 bulan berikutnya.
</div>

<!-- RINGKASAN TAHUNAN -->
<table class="data-table" style="margin-bottom: 15px;">
    <thead>
        <tr>
            <th colspan="4" style="background-color: #2c5282;">RINGKASAN TAHUNAN (TAHUN PAJAK {{ $selectedYear }})</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 25%;"><strong>Total Omzet Bruto:</strong></td>
            <td style="width: 25%;">Rp {{ number_format($yearlyTotalOmzet, 0, ',', '.') }}</td>
            <td style="width: 25%;"><strong>Status Entitas:</strong></td>
            <td style="width: 25%;">CV (Badan Usaha) - Tarif Flat 0,5%</td>
        </tr>
        <tr>
            <td><strong>PPh Final Terutang:</strong></td>
            <td class="text-danger font-bold">Rp {{ number_format($yearlyTotalTax, 0, ',', '.') }}</td>
            <td><strong>PPh Final Dibayar:</strong></td>
            <td class="text-success font-bold">Rp {{ number_format($yearlyTotalPaidTax, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td><strong>Selisih Kurang/(Lebih) Bayar:</strong></td>
            <td colspan="3" class="font-bold {{ ($yearlyTotalTax - $yearlyTotalPaidTax) > 0 ? 'text-warning' : 'text-success' }}">
                Rp {{ number_format(abs($yearlyTotalTax - $yearlyTotalPaidTax), 0, ',', '.') }}
                @if(($yearlyTotalTax - $yearlyTotalPaidTax) > 0)
                    (Kurang Bayar)
                @elseif(($yearlyTotalTax - $yearlyTotalPaidTax) < 0)
                    (Lebih Bayar)
                @else
                    (Lunas)
                @endif
            </td>
        </tr>
    </tbody>
</table>

<!-- TABEL REKAP BULANAN -->
<table class="data-table">
    <thead>
        <tr>
            <th>Bulan</th>
            <th class="text-right">Omzet Bruto</th>
            <th class="text-right">PPh Terutang (0,5%)</th>
            <th class="text-right">Telah Dibayar</th>
            <th class="text-right">Kurang/(Lebih) Bayar</th>
            <th class="text-center">Batas Penyetoran</th>
            <th class="text-center" style="width: 90px;">Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach($monthlyData as $row)
            @php
                $diff = $row['tax'] - $row['paid'];
            @endphp
            <tr>
                <td class="font-bold">{{ $row['month_name'] }}</td>
                <td class="text-right">Rp {{ number_format($row['omzet'], 0, ',', '.') }}</td>
                <td class="text-right text-danger font-bold">Rp {{ number_format($row['tax'], 0, ',', '.') }}</td>
                <td class="text-right text-success">Rp {{ number_format($row['paid'], 0, ',', '.') }}</td>
                <td class="text-right font-bold {{ $diff > 0 ? 'text-warning' : ($diff < 0 ? 'text-success' : '') }}">
                    {{ $diff == 0 ? '-' : 'Rp ' . number_format(abs($diff), 0, ',', '.') }}
                </td>
                <td class="text-center" style="font-size: 7.5pt; color: #4a5568;">{{ $row['due_date'] }}</td>
                <td class="text-center">
                    @if($row['tax'] == 0)
                        <span class="badge badge-secondary">Nihil</span>
                    @elseif($diff <= 0)
                        <span class="badge badge-success">Lunas</span>
                    @elseif($row['paid'] > 0)
                        <span class="badge badge-warning">Kurang Bayar</span>
                    @else
                        <span class="badge badge-danger">Belum Bayar</span>
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
    <tr>
        <td style="width: 50%; vertical-align: top;">
            <div style="font-size: 8pt; color: #718096;">
                * Laporan ini merupakan lembar kerja estimasi PPh Final.<br>
                * Pembayaran riil didasarkan pada bukti penyetoran pajak (SSP/BPN) yang sah.
            </div>
        </td>
        <td style="width: 50%; text-align: right; vertical-align: top;">
            <div style="font-size: 9pt; display: inline-block; text-align: center; margin-right: 20px;">
                <p>Mengetahui,</p>
                <br><br><br>
                <p style="text-decoration: underline; font-weight: bold; margin-bottom: 0;">Direktur / Pemilik</p>
                <p style="font-size: 8pt; color: #718096; margin-top: 0;">CV. MAKARONI KEJU</p>
            </div>
        </td>
    </tr>
</table>
@endsection
