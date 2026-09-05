import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

class AuthService {
    constructor() {
        this.auth = getAuth();
        this.db = getFirestore();
    }

    async buscarAlunoPorEmail(email) {
        const alunosRef = collection(this.db, "alunos");
        const q = query(alunosRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        return null;
        }

        // Retorna o ID e os atributos (curso, matricula, semestre) do primeiro documento encontrado
        const docAluno = querySnapshot.docs[0];
        return {
        id: docAluno.id,
        ...docAluno.data()
        };
    }

    async loginAluno(email, senha) {

        const userCredential = await signInWithEmailAndPassword(this.auth, email, senha);
        const user = userCredential.user;

        const dadosAluno = await this.buscarAlunoPorEmail(user.email);

        if (!dadosAluno) {
        await signOut(this.auth);
        throw new Error("ALUNO_NOT_FOUND");
        }

        return {
            uid: user.uid,
            email: user.email,
            aluno: dadosAluno
        };
    }
}

export default new AuthService();