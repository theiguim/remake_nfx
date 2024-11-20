import { prisma } from "..";

async function main() {
    // Criar categorias
    await prisma.categories.createMany({
        data: [
            { name: 'Tecnologias Back-end', position: 1 },
            { name: 'Tecnologias Front-end', position: 2 },
            { name: 'Ferramentas de Desenvolvimento', position: 3 },
            { name: 'Soft-skills', position: 4 },
            { name: 'Carreira', position: 5 },
        ],
    });

    // Buscar categorias criadas
    const categories = await prisma.categories.findMany();

    // Mapeando as categorias por nome para facilitar o uso
    const backendCategory = categories.find((cat) => cat.name === 'Tecnologias Back-end');
    const frontendCategory = categories.find((cat) => cat.name === 'Tecnologias Front-end');
    const toolsCategory = categories.find((cat) => cat.name === 'Ferramentas de Desenvolvimento');
    const softSkillsCategory = categories.find((cat) => cat.name === 'Soft-skills');
    const careerCategory = categories.find((cat) => cat.name === 'Carreira');

    // Verificar se todas as categorias foram criadas corretamente
    if (!backendCategory || !frontendCategory || !toolsCategory || !softSkillsCategory || !careerCategory) {
        throw new Error('Erro ao buscar categorias. Certifique-se de que todas as categorias foram criadas.');
    }

    // Criar cursos
    await prisma.courses.createMany({
        data: [
            { name: 'Programador Full-stack Javascript', synopsis: 'Lorem ipsum...', featured: true, categoryId: backendCategory.id },
            { name: 'Dominando a Linguagem Ruby', synopsis: 'Lorem ipsum...', categoryId: backendCategory.id },
            { name: 'Micro-serviços com Node.js', synopsis: 'Lorem ipsum...', featured: true, categoryId: backendCategory.id },
            { name: 'Criando APIs Profissionais com Ruby on Rails', synopsis: 'Lorem ipsum...', featured: true, categoryId: backendCategory.id },
            { name: 'TDD na Prática: Testando APIs Node.js', synopsis: 'Lorem ipsum...', featured: true, categoryId: backendCategory.id },
            { name: 'TDD na Prática: Testando Aplicações React', synopsis: 'Lorem ipsum...', featured: true, categoryId: frontendCategory.id },
            { name: 'Especialista Front-end: Vue.js', synopsis: 'Lorem ipsum...', categoryId: frontendCategory.id },
            { name: 'Criando Sites e Apps 3D com Three.js', synopsis: 'Lorem ipsum...', categoryId: frontendCategory.id },
            { name: 'Dominando o Bootstrap 5', synopsis: 'Lorem ipsum...', categoryId: frontendCategory.id },
            { name: 'Visual Studio Code para Programadores Javascript', synopsis: 'Lorem ipsum...', categoryId: toolsCategory.id },
            { name: 'Comandos do Terminal Linux: Um Guia Completo', synopsis: 'Lorem ipsum...', categoryId: toolsCategory.id },
            { name: 'Comunicação e Trabalho em Equipe', synopsis: 'Lorem ipsum...', categoryId: softSkillsCategory.id },
            { name: 'Programador Nômade', synopsis: 'Lorem ipsum...', featured: true, categoryId: careerCategory.id },
            { name: 'O Guia do Programador Freelancer', synopsis: 'Lorem ipsum...', categoryId: careerCategory.id },
        ],
    });

    console.log('Categorias e cursos criados com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro ao executar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
