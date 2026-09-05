import { create } from 'zustand';

export interface Transaction {
    id: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    description: string;
    date: string;
    reference?: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

interface WalletState {
    balance: number;
    currency: string;
    transactions: Transaction[];
    paymentMethod: 'wallet' | 'paystack';
    isWalletModalOpen: boolean;

    // Actions
    setPaymentMethod: (method: 'wallet' | 'paystack') => void;
    setWalletModalOpen: (open: boolean) => void;
    addFunds: (amount: number, reference: string, description?: string) => void;
    deductFunds: (amount: number, description: string) => boolean;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    balance: 15000, // Initial demo wallet balance ₦15,000
    currency: 'NGN',
    paymentMethod: 'wallet',
    isWalletModalOpen: false,
    transactions: [
        {
            id: 'tx_001',
            type: 'CREDIT',
            amount: 15000,
            description: 'Initial Wallet Bonus',
            date: new Date(Date.now() - 86400000).toLocaleString(),
            reference: 'ube_init_welcome',
            status: 'SUCCESS',
        },
    ],

    setPaymentMethod: (method) => set({ paymentMethod: method }),

    setWalletModalOpen: (open) => set({ isWalletModalOpen: open }),

    addFunds: (amount, reference, description = 'Paystack Wallet Top-Up') => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'CREDIT',
            amount,
            description,
            date: new Date().toLocaleString(),
            reference,
            status: 'SUCCESS',
        };

        set((state) => ({
            balance: state.balance + amount,
            transactions: [newTx, ...state.transactions],
        }));
    },

    deductFunds: (amount, description) => {
        const { balance, transactions } = get();
        if (balance < amount) {
            return false;
        }

        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'DEBIT',
            amount,
            description,
            date: new Date().toLocaleString(),
            status: 'SUCCESS',
        };

        set({
            balance: balance - amount,
            transactions: [newTx, ...transactions],
        });
        return true;
    },
}));
