
import { toast } from "@/components/ui/use-toast";

// Types for execution results
export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

// Code Runner Service
export const CodeRunner = {
  /**
   * Execute JavaScript code safely using an iframe sandbox
   * @param code - The code to execute
   * @returns Promise with execution result
   */
  executeCode: async (code: string): Promise<ExecutionResult> => {
    try {
      // Create a sandbox iframe to run code safely
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Setup console capture
      let output = '';
      
      // Type assertion for the console object
      const contentWindow = iframe.contentWindow as (Window & { console: Console });
      const originalConsole = contentWindow?.console;
      
      if (contentWindow) {
        // Override console methods to capture output
        contentWindow.console = {
          ...originalConsole,
          log: (...args: any[]) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
            originalConsole?.log(...args);
          },
          error: (...args: any[]) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
            originalConsole?.error(...args);
          },
          warn: (...args: any[]) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
            originalConsole?.warn(...args);
          },
          info: (...args: any[]) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
            originalConsole?.info(...args);
          }
        };
      }
      
      // Execute code in the iframe
      const scriptTag = iframe.contentDocument?.createElement('script');
      if (scriptTag) {
        scriptTag.textContent = code;
        iframe.contentDocument?.body.appendChild(scriptTag);
      }
      
      // Clean up iframe after execution
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
      
      return {
        success: true,
        output: output || 'Code executed successfully (no output)'
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};
