import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { CompanyRegistrationSchema } from '@/lib/validation';

export async function GET() {
  try {
    const user = store.getUserProfile();
    const isCompany = user.tipoUsuario === 'empresa' || user.role === 'COMPANY' || user.role === 'Empresa';
    
    const companyId = user.companyData?.id || user.email;
    const companyJob = companyId ? store.getCompanyJob(companyId) : undefined;
    const allCompanies = store.getCompanyAccounts();

    return NextResponse.json({
      success: true,
      data: {
        user,
        company: user.companyData,
        job: companyJob,
        hasJob: !!companyJob,
        allCompanies,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao buscar informações da empresa' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verificação manual de e-mail duplicado
    if (body.email) {
      const existingCompany = store.getCompanyByEmail(body.email);
      if (existingCompany) {
        return NextResponse.json(
          { success: false, error: 'Este e-mail já está vinculado a uma empresa.' },
          { status: 400 }
        );
      }
    }

    const companyUser = store.registerCompany(body);
    
    // Se o usuário logado for recrutador, não troca a sessão ativa para a empresa cadastrada
    const currentUser = store.getUserProfile();
    if (currentUser.tipoUsuario !== 'recrutador' && currentUser.role !== 'RECRUITER') {
      store.setCurrentUser(companyUser);
    }

    return NextResponse.json(
      {
        success: true,
        data: companyUser,
        message: 'Empresa cadastrada com sucesso!',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao cadastrar empresa' },
      { status: 400 }
    );
  }
}
