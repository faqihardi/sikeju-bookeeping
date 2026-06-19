<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title')</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #2d3748;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .header-text {
            text-align: center;
            vertical-align: middle;
        }
        .company-name {
            font-size: 16pt;
            font-weight: bold;
            color: #1a365d;
            text-transform: uppercase;
            margin: 0;
            letter-spacing: 1px;
        }
        .company-details {
            font-size: 8pt;
            color: #4a5568;
            margin-top: 3px;
        }
        .header-line {
            border-top: 2px solid #1a365d;
            border-bottom: 1px solid #1a365d;
            height: 3px;
            margin-bottom: 15px;
        }
        .report-title {
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 3px;
            text-transform: uppercase;
        }
        .report-period {
            text-align: center;
            font-size: 9pt;
            color: #718096;
            margin-bottom: 15px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .data-table th {
            background-color: #2b6cb0;
            color: white;
            font-size: 8.5pt;
            font-weight: bold;
            padding: 6px 8px;
            text-align: left;
            border: 1px solid #cbd5e0;
        }
        .data-table td {
            font-size: 8.5pt;
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
        }
        .data-table tr:nth-child(even) td {
            background-color: #f7fafc;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: bold;
        }
        .bg-gray-50 {
            background-color: #f7fafc !important;
        }
        .bg-gray-100 {
            background-color: #edf2f7 !important;
        }
        .bg-blue-50 {
            background-color: #ebf8ff !important;
        }
        .bg-emerald-50 {
            background-color: #f0fff4 !important;
        }
        .bg-red-50 {
            background-color: #fff5f5 !important;
        }
        .text-danger {
            color: #c53030;
        }
        .text-success {
            color: #276749;
        }
        .text-warning {
            color: #c05621;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            text-align: center;
            font-size: 7.5pt;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 4px;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 7.5pt;
            font-weight: bold;
            border-radius: 4px;
            text-align: center;
        }
        .badge-success {
            background-color: #c6f6d5;
            color: #22543d;
        }
        .badge-warning {
            background-color: #feebc8;
            color: #744210;
        }
        .badge-danger {
            background-color: #fed7d7;
            color: #742a2a;
        }
        .badge-secondary {
            background-color: #edf2f7;
            color: #2d3748;
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td class="header-text">
                <div class="company-name">CV. MAKARONI KEJU</div>
                <div class="company-details">
                    Jl. Pemuda No. 123, Purwokerto, Banyumas, Jawa Tengah 53124<br>
                    Email: finance@makaronikeju.com | Telp: 0812-3456-7890
                </div>
            </td>
        </tr>
    </table>
    <div class="header-line"></div>

    <div class="report-title">@yield('report_title')</div>
    <div class="report-period">@yield('report_period')</div>

    @yield('content')

    <div class="footer">
        Dicetak otomatis oleh Sistem Keuangan SIKEJU pada {{ date('d-m-Y H:i:s') }}
    </div>
</body>
</html>
