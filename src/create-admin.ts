import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'super_admin',
      status: 'active',
    })
    .select();

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully:', data);
  }
}

createAdminUser();
