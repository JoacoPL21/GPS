import chalk from 'chalk';
import { AppDataSource } from './configDB.js';
import User from '../entity/User.js';

async function createUser() {
  try {
    const UserRepository = AppDataSource.getRepository(User);

    const count = await UserRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Cursos ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      UserRepository.save(UserRepository.create({
        name: "SkibidiDop",
        email: "skibidi@gmail.com"
      })),
      UserRepository.save(UserRepository.create({
        name: "Toilete",
        email: "toilete@gmail.com"
      })),
      UserRepository.save(UserRepository.create({
        name: "SigmaBoy",
        email: "sigmaboy@gmail.com"
      })),
    ]);

    console.log(chalk.green("✅ Usuarios creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear usuarios:", error));
  }
}

export default createUser;
