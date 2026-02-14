import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectSchema() {
    console.log('🔍 Inspecting schema...')

    // Check clinicas (for clients/directory)
    const { data: clinica } = await supabase.from('clinicas').select('*').limit(1)
    console.log('--- clinicas ---')
    if (clinica && clinica[0]) console.log(Object.keys(clinica[0]))

    // Check catalogo_servicios (for services)
    const { data: servicio } = await supabase.from('catalogo_servicios').select('*').limit(1)
    console.log('--- catalogo_servicios ---')
    if (servicio && servicio[0]) console.log(Object.keys(servicio[0]))

    // Check ordenes_trabajo (for orders)
    const { data: orden } = await supabase.from('ordenes_trabajo').select('*').limit(1)
    console.log('--- ordenes_trabajo ---')
    if (orden && orden[0]) console.log(Object.keys(orden[0]))
}

inspectSchema().catch(console.error)
