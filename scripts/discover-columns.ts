import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function discoverColumns() {
    console.log('🔍 Discovering columns...')

    // We can use the information_schema via a RPC if available, 
    // but since we probably don't have it, we'll try a common trick: 
    // select a single row and look at the keys if any, 
    // or try an invalid column to get the list in the error message if possible.

    const tables = ['clinicas', 'catalogo_servicios', 'ordenes_trabajo']

    for (const table of tables) {
        console.log(`--- Table: ${table} ---`)
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]))
        } else if (error) {
            console.log('Error:', error.message)
        } else {
            console.log('Table is empty. Trying to guess by error...')
            // Try to select a non-existent column to see if it lists columns
            const { error: err2 } = await supabase.from(table).select('non_existent_column_123').limit(1)
            console.log('Hint from error:', err2?.message)
        }
    }
}

discoverColumns().catch(console.error)
