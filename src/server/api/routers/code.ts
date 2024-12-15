import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exec } from "child_process";
import util from "util";
import { TRPCError } from "@trpc/server";

const execPromise = util.promisify(exec);

export const codeRouter = createTRPCRouter({
  compile: publicProcedure
    .input(z.object({ language: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      const { language, code } = input;

      let command;
      if (language === 'python') {
        command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
      } else if (language === 'go') {
          command = `go run -e "${code.replace(/"/g, '\\"')}"`;
      } else {
          throw new TRPCError({ code: 'BAD_REQUEST', message: "Unsupported language" });
      }

      try {
        const { stdout, stderr } = await execPromise(command);
        return { output: stdout || stderr };
      } catch (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
    }),
});

