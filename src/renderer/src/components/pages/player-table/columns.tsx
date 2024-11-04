import { ColumnDef } from '@tanstack/react-table'

export type Player = {
    display_name: string,
    playfab_id: string,
}

export const columns: ColumnDef<Player>[] = [
    {
        accessorKey: 'display_name',
        header: 'Name',
    },
    {
        accessorKey: 'playfab_id',
        header: 'PlayFab ID',
    }
]