<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for($u = 0; $u < 10; $u++){
            $chrono = 1;
            $user = new User();
            $hash = $this->encoder->encodePassword($user, "password");
            $user->setFirstName($faker->firstname())
                ->setLastName($faker->lastname())
                ->setEmail($faker->email())
                ->setPassword($hash)
                ;
            $manager->persist($user);

            for($c = 0; $c < mt_rand(5, 15); $c++){
                $customer = new Customer();
                $customer->setFirstname($faker->firstname())
                        ->setLastname($faker->lastname())
                        ->setCompany($faker->company())
                        ->setEmail($faker->email())
                        ->setUser($user)
                        ;
    
                $manager->persist($customer);
    
                for($i = 0; $i < mt_rand(3, 10); $i++){
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono)
                            ;
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
