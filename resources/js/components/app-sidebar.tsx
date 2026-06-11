import { Link } from '@inertiajs/react';
import { FolderGit2, LayoutGrid, Wheat, PackageSearch, TruckIcon, BookUser, Wrench, BadgeDollarSign, Banknote, ChartCandlestick, Activity, ShoppingCart, TrendingDown, TrendingUp, Weight, CookingPot, SearchCheck, BookOpenText, ArrowDownUp, Scale } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import * as materials from '@/actions/App/Http/Controllers/BahanBakuController';
import * as products from '@/actions/App/Http/Controllers/ProdukController';
import * as suppliers from '@/actions/App/Http/Controllers/PemasokController';
import * as customers from '@/actions/App/Http/Controllers/PelangganController';
import * as equipments from '@/actions/App/Http/Controllers/PeralatanController';
import * as paymentMethods from '@/actions/App/Http/Controllers/MetodePembayaranController';
import * as cash from '@/actions/App/Http/Controllers/KasController';
import * as modals from '@/actions/App/Http/Controllers/ModalController';
import * as expenses from '@/actions/App/Http/Controllers/PengeluaranOperasionalController';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const masterDataNavItems: NavItem[] = [
    {
        title: 'Bahan Baku',
        href: materials.index(),
        icon: Wheat,
    },
    {
        title: 'Produk',
        href: products.index(),
        icon: PackageSearch,
    },
    {
        title: 'Pemasok',
        href: suppliers.index(),
        icon: TruckIcon,
    },
    {
        title: 'Pelanggan',
        href: customers.index(),
        icon: BookUser,
    },
    {
        title: 'Peralatan',
        href: equipments.index(),
        icon: Wrench,
    },
    {
        title: 'Metode Pembayaran',
        href: paymentMethods.index(),
        icon: BadgeDollarSign,
    },
]

const financeNavItems: NavItem[] = [
    {
        title: 'Kas',
        href: cash.index(),
        icon: Banknote
    },
    {
        title: 'Modal',
        href: modals.index(),
        icon: ChartCandlestick
    },
    {
        title: 'Biaya Operasional',
        href: expenses.index(),
        icon: Activity
    },
]

const purchaseNavItems: NavItem[] = [
    {
        title: 'Transaksi Pembelian',
        href: dashboard(),
        icon: ShoppingCart
    },
    {
        title: 'Hutang Usaha',
        href: dashboard(),
        icon: TrendingDown
    },
]

const salesNavItems: NavItem[] = [
    {
        title: 'Transaksi Penjualan',
        href: dashboard(),
        icon: Weight
    },
    {
        title: 'Piutang Usaha',
        href: dashboard(),
        icon: TrendingUp
    },
]

const productionNavItems: NavItem[] = [
    {
        title: 'Produksi',
        href: dashboard(),
        icon: CookingPot
    },
    {
        title: 'Koreksi Stok',
        href: dashboard(),
        icon: SearchCheck
    },
]

const reportNavItems: NavItem[] = [
    {
        title: 'Laba Rugi',
        href: dashboard(),
        icon: BookOpenText
    },
    {
        title: 'Arus Kas',
        href: dashboard(),
        icon: ArrowDownUp
    },
    {
        title: 'Posisi Keuangan',
        href: dashboard(),
        icon: Scale
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/faqihardi/sikeju-bookeeping',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} group='Platform' />
                <NavMain items={masterDataNavItems} group='Master Data' />
                <NavMain items={financeNavItems} group='Keuangan & Kas' />
                <NavMain items={purchaseNavItems} group='Pembelian' />
                <NavMain items={salesNavItems} group='Penjualan' />
                <NavMain items={productionNavItems} group='Produksi' />
                <NavMain items={reportNavItems} group='Laporan' />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
