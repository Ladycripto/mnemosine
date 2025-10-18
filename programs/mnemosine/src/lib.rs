use anchor_lang::prelude::*;

declare_id!("7Q811Ki9dNuqshsadARZAfLdHoDmUejkGAXbdDFAkVyw");

#[program]
pub mod mnemosine {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
