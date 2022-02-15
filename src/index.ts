import { ChildProcess, exec as _exec } from "child_process";
import internal from "stream";

export interface ChildProcessWithStdout extends ChildProcess {
  stdout: internal.Readable;
}

export const execStream = (cmd: string): ChildProcessWithStdout => {
  const stream = _exec(cmd);
  if (!stream.stdout) throw new Error("There's no stdout.");

  return stream as ChildProcessWithStdout;
};

export const exec = (
  cmd: string,
  pipeStdout: NodeJS.WriteStream | null = null
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const stream = execStream(cmd);

    if (pipeStdout) stream.stdout.pipe(pipeStdout);

    stream.stdout.on("error", reject);
    stream.stdout.on("end", resolve);
  });

export const execWithOut = (
  cmd: string,
  lineCb: (line: string) => string
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const stream = execStream(cmd);

    stream.stdout.on("data", lineCb);
    stream.stdout.on("error", reject);
    stream.stdout.on("end", resolve);
  });
