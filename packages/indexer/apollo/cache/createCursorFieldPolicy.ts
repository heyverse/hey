import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createCursorFieldPolicy = (keyArgs: FieldPolicy['keyArgs']): FieldPolicy =>
  cursorBasedPagination(keyArgs);

export default createCursorFieldPolicy;
