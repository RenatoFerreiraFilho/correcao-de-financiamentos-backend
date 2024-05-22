import { connect } from "./db.js";
import fs from "fs";
import xlsx from "xlsx";

async function getDataTable() {
    const res = await conn.query(`SELECT * FROM indices_de_correcao`);
    return res.rows;
}

async function insertDataTable() {
    const conn = await connect();
    try {
        const workbook = xlsx.readFile(
            `/Users/renatoferreira/Documents/01 - Projetos Dev/04 - Projeto Aplicado XP/correcao-de-financiamentos-backend/correcao-de-financiamentos-backend/repositories/indices.xlsx`
        );
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (let row of data) {
            const { data_calendario, IPCA, IGPM, INCC } = row;
            const query = `
                INSERT INTO indices_de_correcao (data_calendario, IPCA, IGPM, INCC)
                VALUES ($1, $2, $3, $4)
            `;
            const values = [data_calendario, IPCA, IGPM, INCC];

            await conn.query(query, values);
        }

        // const sql = `
        // CREATE TABLE indices_de_correcao (
        //     data_calendario DATE,
        //     IPCA NUMERIC(10, 2),
        //     IGPM NUMERIC(10, 2),
        //     INCC NUMERIC(10, 2)
        // );
        // `;
        // const res = await conn.query(sql);
        return data;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}
async function insertProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    const conn = await connect();
    try {
        /* editar query: */
        const sql = "INSERT INTO logs (name, cpf) VALUES ($1, $2) RETURNING *";
        /* inserir campos do banco de dados: */
        const values = [ProcessaDadosFinanciamento.name, ProcessaDadosFinanciamento.cpf];

        const res = await conn.query(sql, values);
        return res.rows[0];
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

async function getIndiceInflacao(indice, data) {
    const conn = await connect();
    try {
        const res = await conn.query(`SELECT ${indice} FROM indices WHERE data = ${data}`);

        return res.rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

export default {
    insertProcessaDadosFinanciamento,
    getIndiceInflacao,
    insertDataTable,
    getDataTable,
};
