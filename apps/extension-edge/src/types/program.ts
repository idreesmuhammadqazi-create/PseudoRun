/**
 * Program Type Definition
 * Represents a saved pseudocode program
 */

export interface Program {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProgramCreate {
  name: string;
  code: string;
}

export interface ProgramUpdate {
  name?: string;
  code?: string;
}
