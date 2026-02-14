import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
    console.log('🔍 Checking tables...')

    const tablesToCheck = ['clientes', 'clinicas', 'servicios', 'catalogo_servicios', 'ordenes', 'ordenes_trabajo']

    for (const table of tablesToCheck) {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.log(`❌ ${table}: ${error.message}`)
        } else {
            console.log(`✅ ${table}: Available`)
        }
    }
}

checkTables().catch(console.error)
